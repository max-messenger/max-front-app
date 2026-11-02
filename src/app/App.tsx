import { AppRouter } from './router'

function App() {
  return (
    <>
      <AppRouter />
      {/* Контейнер для порталов модалок: внутри поддерева MaxUI-провайдера,
          чтобы CSS-переменные дизайн-токенов наследовались в DOM */}
      <div id="modal-root" />
    </>
  )
}

export default App
