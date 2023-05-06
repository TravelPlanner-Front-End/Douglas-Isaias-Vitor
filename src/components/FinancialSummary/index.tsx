import { useTravelContext } from "../../providers/TravelContext";
import { StyledDiv } from "./style";

export const FinancialSummary = () => {
  const { travel, savings } = useTravelContext();

  let total = 0;

  if (travel) {
    total =
      Number(travel[0].accommodation) +
      Number(travel[0].food) +
      Number(travel[0].initialValue) +
      Number(travel[0].other_expenses) +
      Number(travel[0].shopping) +
      Number(travel[0].transport);
  }

  let totalSavings = 0;

  if (savings && travel) {
    totalSavings = savings.reduce(
      (accumulator, currentValue) => accumulator + Number(currentValue.value),
      travel[0].initialValue ? Number(travel[0].initialValue) : 0
    );
  }
  const missingValue = total - totalSavings;

  return (
    <>
      {savings ? (
        <StyledDiv>
          <p>
            Custo total da viagem: R$ {" "}
            <span className="totalTripCostAndMonths">
              {total}
            </span>
          </p>
          {totalSavings >= total ? (
            <p>Você já economizou o valor necessário</p>
          ) : (
            <p>
              Valor restante: R$ 
              <span className="missingValue"> {missingValue}</span>
            </p>
          )}
        </StyledDiv>
      ) : (
        <StyledDiv>
          <p>
            Custo total da viagem{" "}
            <span className="totalTripCostAndMonths">
              {total}
            </span>
          </p>
          <p>
            <span className="missingValue">{`R$ ${{ total }},00`}</span>
          </p>
        </StyledDiv>
      )}
    </>
  );
};
