import { useGetItemsQuery } from '../../../__generated__/types-and-hooks'

// components
import Item from '../../components/Item'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

interface Props {
  bought: boolean
}

export default function ItemsPage(props: Props) {
  const { data, loading, error } = useGetItemsQuery({
    variables: {
      filterBought: {
        bought: props.bought,
      },
    },
  })

  return (
    <Box
      sx={{
        padding: '2em 1em',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {error ? (
        <Alert severity="error">{error.message}</Alert>
      ) : loading ? (
        <CircularProgress />
      ) : (
        data?.items.map((item) => (
          <Item
            key={item.id}
            item={item}
            action={!item.bought ? 'link' : 'none'}
          />
        ))
      )}
    </Box>
  )
}
