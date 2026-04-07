function SocialButton({ provider, onClick, isLoading, disabled }) {
  return (
    <button
      type="button"
      className="social-button"
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading ? `Connecting to ${provider}...` : provider}
    </button>
  )
}

export default SocialButton
