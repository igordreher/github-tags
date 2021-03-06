import { useSession, signOut, signIn } from 'next-auth/client';
import styles from './styles.module.scss';

export default function Header() {
  const [session] = useSession();

  return (
    <header className={styles.headerContainer}>
      {session ? (<>
        <form action="/search">
          <input type="search" name="q" id="" placeholder="Search repo by @tag" />
        </form>
        <details data-cy="user-menu" className={styles.detailsOverlay}>
          <summary>
            <img src={session.user.image} alt="User Avatar" className={styles.userAvatar} sizes="20" />
          </summary>
          <menu className={styles.detailsMenu}>
            <div className={styles.menuItem}>
              Signed in as <strong>{session.user.name}</strong>
            </div>
            <div className={styles.menuDivider}></div>
            <button className={styles.menuItem} onClick={() => signOut()} >Sign out</button>
          </menu>
        </details>
      </>) : (<>
        <button data-cy="sign-in" className={styles.signIn} onClick={() => signIn('github')}>Sign in</button>
      </>)
      }
    </header>
  );
}