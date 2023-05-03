import { createContext, useContext, useState } from "react";
import { api } from "../services/api";
import { toast } from "react-hot-toast";
import { IRegisterNewValueForm } from "../components/Form/RegisterNewValueForm";
import { TTravelSchema } from "../schemas/travelSchema";

interface ITravelProviderProps {
  children: React.ReactNode;
}

interface ITravelContext {
  addNewValue: (formData: IRegisterNewValueForm) => Promise<void>;
  loadSavings: () => Promise<void>;
  savings: ISaving[];
  newTravel: (formData: TTravelSchema) => Promise<void>;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenModal: boolean;
}

interface ISaving {
  month: string;
  value: number;
  userId: number;
  travelId: number;
  id: number;
}

export const TravelContext = createContext({} as ITravelContext);

export const TravelProvider = ({ children }: ITravelProviderProps) => {
  const [savings, setSavings] = useState([]);

  const [travel, setTravel] = useState([]);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const tokenLocalStorage = localStorage.getItem("@TRAVELER:TOKEN");
  const idLocalStorage = localStorage.getItem("@TRAVELER:ID");

  //add nova viagem
  const newTravel = async (formData: TTravelSchema) => {
    const body = {
      ...formData,
      userId: idLocalStorage,
    };
    try {
      //api teste
      const { data } = await api.post("travel", body, {
        headers: {
          Authorization: `Bearer ${tokenLocalStorage}`,
        },
      });

      setTravel(data);

      setIsOpenModal(false);

      console.log("passei na requisição:", data);
    } catch (error) {
      console.log("deu erro");
    }
  };

  // Parte da inclusão das economias do mês e renderização do resumo mensal
  const addNewValue = async (formData: IRegisterNewValueForm) => {
    const body = {
      ...formData,
      userId: idLocalStorage,
      travelId: "inserir id da travel",
    };
    try {
      const response = await api.post("/savings", body, {
        headers: {
          Authorization: `Bearer ${tokenLocalStorage}`,
        },
      });
      console.log(response);
      //   setSavings([...savings, response]);
    } catch (error) {
      console.log(error);
      toast.error("Ops! Algo deu errado.");
    }
  };

  const loadSavings = async () => {
    try {
      const { data } = await api.get(`users/${idLocalStorage}?_embed=travel`, {
        headers: {
          Authorization: `Bearer ${tokenLocalStorage}`,
        },
      });
      setSavings(data.savings);
    } catch (error) {
      console.log(error);
      toast.error("Ops! Algo deu errado.");
    }
  };

  return (
    <TravelContext.Provider
      value={{
        addNewValue,
        loadSavings,
        savings,
        setIsOpenModal,
        isOpenModal,
        newTravel,
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};

export const useTravelContext = () => useContext(TravelContext);
