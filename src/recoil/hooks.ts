import { useState, useEffect } from "react";
import { RecoilState } from "./types";

const updateHooks = (recoilState: RecoilState) => {
  const [, updateState] = useState({});

  useEffect(() => {
    const { unsubscribe } = recoilState.subscribe(() => updateState({}));
    return () => unsubscribe();
  }, [recoilState]);
};

export const useRecoilValue = (recoilState: RecoilState) => {
  updateHooks(recoilState);
  return recoilState.getter();
};

export const useSetRecoilState = (recoilState: RecoilState) => {
  return recoilState.setter;
};

export const useRecoilState = (recoilState: RecoilState) => {
  updateHooks(recoilState);
  return [recoilState.getter(), recoilState.setter];
};
