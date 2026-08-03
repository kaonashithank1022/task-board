import { useState, type FormEvent } from 'react'
import type { Task } from './types'
import './App.css'

const STORAGE_KEY = 'task-board:tasks'

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Task[]) : []
  } catch {
    return []
  }
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [text, setText] = useState('')

  const persist = (next: Task[]) => {
    setTasks(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const addTask = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    const newTask: Task = { id: crypto.randomUUID(), text: trimmed, done: false }
    persist([...tasks, newTask])
    setText('')
  }

  const toggleTask = (id: string) => {
    persist(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  const deleteTask = (id: string) => {
    persist(tasks.filter((t) => t.id !== id))
  }

  return (
    <div className="board">
      <h1>Task Board</h1>

      <form className="add-form" onSubmit={addTask}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="新しいタスクを入力..."
          aria-label="新しいタスク"
        />
        <button type="submit">追加</button>
      </form>

      {tasks.length === 0 ? (
        <p className="empty">タスクはまだありません</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.done ? 'task done' : 'task'}>
              <label className="task-label">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                />
                <span>{task.text}</span>
              </label>
              <button
                type="button"
                className="delete-button"
                onClick={() => deleteTask(task.id)}
                aria-label={`「${task.text}」を削除`}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
