export interface IRadarrMovie {
  title: string;
  originalTitle: string;
  originalLanguage: {
    id: number;
    name: string;
  };
  alternateTitles: {
    sourceType: string;
    movieMetadataId: number;
    title: string;
    sourceId: number;
    votes: number;
    voteCount: number;
    language: {
      id: number;
      name: string;
    };
  }[];
  secondaryYearSourceId: number;
  sortTitle: string;
  sizeOnDisk: number;
  status: string;
  overview: string;
  inCinemas: string;
  physicalRelease: string;
  digitalRelease: string;
  images: {
    coverType: string;
    url: string;
    remoteUrl: string;
  }[];
  website: string;
  remotePoster?: string;
  year: number;
  hasFile: boolean;
  youTubeTrailerId: string;
  studio: string;
  qualityProfileId: number;
  monitored: boolean;
  minimumAvailability: string;
  isAvailable: boolean;
  folderName: string;
  runtime: number;
  cleanTitle: string;
  imdbId: string;
  tmdbId: number;
  titleSlug: string;
  folder: string;
  certification: string;
  genres: string[];
  tags: string[];
  added: string;
  ratings: {
    imdb?: {
      votes: number;
      value: number;
      type: string;
    };
    tmdb?: {
      votes: number;
      value: number;
      type: string;
    };
    metacritic?: {
      votes: number;
      value: number;
      type: string;
    };
    rottenTomatoes?: {
      votes: number;
      value: number;
      type: string;
    };
  };
  popularity: number;
}

export interface IPostRadarrMovie extends IRadarrMovie {
  rootFolderPath: string;
  qualityProfileId: number;
  addOptions: {
    addMethod: 'manual';
    monitor: 'movieOnly';
    searchForMovie: boolean;
  };
}
