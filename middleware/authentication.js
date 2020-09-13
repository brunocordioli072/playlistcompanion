export default function({ app, store, redirect }) {
  // If the user is not authenticated
  if (!store.state.isAuthenticated && app.router.history.current.fullPath != "/") {
    return redirect("/");
  } 
}
