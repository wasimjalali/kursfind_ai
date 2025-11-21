export default function ProviderLayout({ children }) {
  // Simple passthrough layout - authentication is handled at page level
  return <>{children}</>;
}
