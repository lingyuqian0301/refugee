import { cookies } from 'next/headers'
import { createClient } from '../../utils/supabase/server'

export default async function Page() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    // Perform a simple query to test the connection
    const { data: todos, error } = await supabase.from('todos').select()

    if (error) {
      console.error('Error fetching todos:', error)
      return <div>Error fetching todos: {error.message}</div>
    }

    return (
      <div>
        <div>Successfully connected to Supabase!</div>
        <ul>
          {todos?.map((todo) => (
            <li key={todo.id}>{todo.title}</li>
          ))}
        </ul>
      </div>
    )
  } catch (err) {
    console.error('Unexpected error:', err)
    return <div>Unexpected error: {err.message}</div>
  }
}