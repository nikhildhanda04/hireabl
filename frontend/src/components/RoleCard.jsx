function RoleCard({ title, selected, onClick }) {
  return (
    <button
      type="button"
      className={`role-card${selected ? ' role-card--selected' : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <h3>{title}</h3>
    </button>
  )
}

export default RoleCard
