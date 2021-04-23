import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
  description: string;
}

type EpisodeProps = {
  episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button type="button">
          <img src="/play.svg" alt="Tocar Episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  )
}

//Estrutua Next:
// Client (Browser) = Next.JS (Node.JS) == Server (Back-end)

//Função responsável por retornar uma pagina dinamica statica
//Essa função é possivel informar quais paginas dinamica serão feita estaticamente por um periodo
//Caso o paths seja um objeto vazio, então ira ser exibido todas as paginas dinamicas, mas o fallback precisa ser blocking (Roda no Next.js)
//Se o fallback for false só sera gerado a pagina estatica das paginas que forem passadas no objeto 
//Se o fallback for true os dados serão rodados na camada cliente (Browser)
export const getStaticPaths: GetStaticPaths = async () => {
  //Metodo para pegar os dados das duas ultimas paginas
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  })
  //passando os dados da duas ultimas paginas para o formato correto
  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  })

  return {
    paths, //Passando as pagina que terão sua criação já de inicio, independente de serem acessadas
    //paths: [], falando que não irar criar a versão statica de nenhuma pagina no build, só no decorrer dos acessos
    fallback: 'blocking' //Incremental static regeneration
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  const { data } = await api.get(`/episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  }

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24, //24 Hours
  }
}