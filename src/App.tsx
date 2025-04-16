import { useAuthenticator } from "@aws-amplify/ui-react";
import CharacterPage from "./features/pages/CharacterPage";

function App() {
  const { user, signOut } = useAuthenticator();

  return (
    <main>
      <header>
        <h1>Welcome {user?.signInDetails?.loginId}</h1>
        <button onClick={signOut}>Sign out</button>
        <div className="bg-green-500 text-white p-4 rounded-lg">
  ✅ Tailwind is working!
</div>

      </header>

      <CharacterPage />
    </main>
  );
}

export default App;
