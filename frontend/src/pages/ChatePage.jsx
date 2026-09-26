import { useAuthStore } from '../store/useAuthStore'

function ChatePage() {
  const {logout} = useAuthStore();
  return (
    <div>ChatePage
      <button onClick={logout}>logout</button>
    </div>
  )
}

export default ChatePage