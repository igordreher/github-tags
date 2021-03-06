import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { getStarredRepos } from './api/starred';
import { getTags } from './api/tags';
import Repository from 'components/Repository';
import filterRepos from 'utils/filterRepos';

import styles from 'styles/search.module.scss';

interface Tag {
  id: number;
  name: string;
}

interface Repository {
  id: number;
  name: string;
  description: string;
  url: string;
  tags: Tag[];
}

interface SearchProps {
  searchResults: Repository[];
}

export default function Search({ searchResults }: SearchProps) {

  return (
    <div className={styles.container}>
      {searchResults ?
        <ul className={styles.repoList}>
          <h3>{searchResults.length} repository results</h3>
          {searchResults.map(repo => {
            return (
              <li key={repo.id}>
                <Repository >{repo}</Repository>
              </li>
            );
          })}
        </ul>
        : <>
          <div className={styles.emptyQuery}>
            <h2>Search for starred repositories by @tags</h2>
            <span>Use @ + tag name to search by tags</span>
          </div>
        </>
      }
    </div>
  );
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    };
  }
  const q = ctx.query.q as string;

  if (typeof (q) === 'string') {
    const starredRepos = await getStarredRepos(ctx);
    const tags = await getTags(ctx);
    const tagName = q.startsWith('@') ? q.substr(1) : '';
    const result = filterRepos(starredRepos, tags, tagName);

    return {
      props: {
        searchResults: result
      }
    };
  }

  else {
    return {
      props: {
        searchResults: null
      }
    };
  }
};