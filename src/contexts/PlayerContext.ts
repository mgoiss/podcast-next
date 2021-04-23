//API CONTEXT: é usada quando precisa que mais de um componente compartilhes as mesmas informações
//Para isso os componentes devem está englobada nas tag dessa API CONTEXT (PlayerContext) 
//Nesse caso está sendo usado na _app.tsx para compartilha as informações entre Component e o Player

import { createContext } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  play: (episode: Episode) => void;
}

export const PlayerContext = createContext({} as PlayerContextData);