import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Item as ItemType,
  useDeleteItemMutation,
} from '../../../__generated__/types-and-hooks'

// hooks
import { useAuth } from '../../hooks/useAuth'

// components
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Grow from '@mui/material/Grow'
import IconButton from '@mui/material/IconButton'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Fade from '@mui/material/Fade'
import BuyElementWrapper from './BuyElement'

interface Props {
  item: ItemType
  action: 'link' | 'buy' | 'none'
  refetch: () => void
}

export default function Item(props: Props) {
  const { isAuthed } = useAuth()
  const { item } = props
  const [show, setShow] = useState(true)
  const [deleteItem] = useDeleteItemMutation()
  const handleDelete = async () => {
    const res = await deleteItem({
      variables: {
        id: props.item.id,
      },
    })
    if (res.errors) {
      return toast.error('Something went wrong')
    }
    toast.success('Removed item')
    setShow(false)
    setTimeout(props.refetch, 250)
  }
  return (
    <Grow appear in={show}>
      <Card
        sx={{
          margin: '.5em',
          width: '24em',
          maxWidth: '100%',
        }}
        variant="outlined"
      >
        <Alert severity={!item.bought ? 'success' : 'error'}>
          <Typography
            sx={{
              fontSize: '1em',
              width: 'fit-content',
            }}
            color={!item.bought ? 'success' : 'error'}
          >
            {!item.bought ? 'For Sale!' : 'Item has been purchased'}
          </Typography>
        </Alert>
        <CardContent
          sx={{
            position: 'relative',
          }}
        >
          {props.action !== 'buy' && isAuthed && (
            <Fade appear in>
              <IconButton
                sx={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                }}
                onClick={handleDelete}
              >
                <DeleteOutlinedIcon color="disabled" />
              </IconButton>
            </Fade>
          )}
          <Typography variant="h5" component="div">
            {item.name}
          </Typography>
          <Typography color="text.secondary">{item.description}</Typography>
          <Typography
            sx={{
              marginTop: '1em',
            }}
          >
            {item.price}$
          </Typography>
        </CardContent>
        <CardActions>
          {props.action === 'link' ? (
            <Link
              to={`/item/${item.id}`}
              style={{
                textDecoration: 'none',
              }}
            >
              <Button size="small">buy item</Button>
            </Link>
          ) : props.action === 'buy' ? (
            <BuyElementWrapper item={item} refetch={props.refetch} />
          ) : null}
        </CardActions>
      </Card>
    </Grow>
  )
}
