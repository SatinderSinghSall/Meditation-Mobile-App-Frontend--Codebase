import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

interface TimerContextProps {
  duration: number;
  setDuration: Dispatch<SetStateAction<number>>;

  initialDuration: number;
  setInitialDuration: Dispatch<SetStateAction<number>>;
}

export const TimerContext = createContext<TimerContextProps>({
  duration: 10,
  setDuration: () => {},

  initialDuration: 10,
  setInitialDuration: () => {},
});

interface TimerProviderProps {
  children: ReactNode;
}

const TimerProvider = ({ children }: TimerProviderProps) => {
  const [duration, setDuration] = useState(10);
  const [initialDuration, setInitialDuration] = useState(10);

  return (
    <TimerContext.Provider
      value={{
        duration,
        setDuration,

        initialDuration,
        setInitialDuration,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export default TimerProvider;
