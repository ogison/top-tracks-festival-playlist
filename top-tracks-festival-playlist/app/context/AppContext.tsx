"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Artist, Track } from "../types";

type AppContextType = {
  topTracks: Track[];
  setTopTracks: React.Dispatch<React.SetStateAction<Track[]>>;
  artistSuggestions: Artist[];
  setArtistSuggestions: React.Dispatch<React.SetStateAction<Artist[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isErrorDialogOpen: boolean;
  setIsErrorDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

// Contextを作成
const AppContext = createContext<AppContextType | undefined>(undefined);

// Providerを作成
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // 楽曲を管理
  const [topTracks, setTopTracks] = useState<Track[]>([]);

  // アーティスト候補を管理
  const [artistSuggestions, setArtistSuggestions] = useState<Artist[]>([]);

  //　ローディングの状態を管理
  const [loading, setLoading] = useState<boolean>(false);

  // ダイアログ表示を管理
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const value: AppContextType = {
    topTracks,
    setTopTracks,
    artistSuggestions,
    setArtistSuggestions,
    loading,
    setLoading,
    isErrorDialogOpen,
    setIsErrorDialogOpen,
    errorMessage,
    setErrorMessage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// カスタムフック: useAppContext
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
