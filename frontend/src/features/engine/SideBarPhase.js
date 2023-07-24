import React from "react";
import { useSelector } from "react-redux";
import { useGameL10n } from "./hooks/useGameL10n";
import { useGameDefinition } from "./hooks/useGameDefinition";
import { SideBarRoundStep } from "./SideBarRoundStep";

export const SideBarPhase = React.memo(({
  phaseId,
  triggerMap,
}) => {
  const gameL10n = useGameL10n();
  const gameDef = useGameDefinition();
  const currentStepId = useSelector(state => state?.gameUi?.game?.stepId);
  const currentPhaseId = useSelector(state => state?.gameUi?.game?.steps?.[currentStepId]?.phaseId);
  const phaseInfo = useSelector(state => state?.gameUi?.game?.phases?.[phaseId]);
  console.log("Rendering SideBarPhase", {currentStepId, currentPhaseId, phaseId, phaseInfo});
  const isPhase = phaseId === currentPhaseId;
  return (
    <div 
      className={"relative text-center select-none text-gray-100"}
      style={{height: phaseInfo.height, maxHeight: phaseInfo.height, borderBottom: (phaseId === "End") ? "" : "1px solid"}}>
      <div
        className={`absolute h-full pointer-events-none ${isPhase ? "bg-red-800" : ""}`}
        style={{width:"3vh"}}>
        <div className="absolute" style={{top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(90deg)"}}>
          {gameL10n(phaseInfo.label)}
        </div>
      </div>
      <div className="w-full h-full flex flex-col float-left">
        {gameDef?.stepOrder?.map((stepId, _stepIndex) => {
          const stepInfo = gameDef?.steps?.[stepId];
          if (stepInfo?.phaseId == phaseId)
            return (
              <SideBarRoundStep
                key={stepInfo.stepId}
                stepId={stepId}
                triggerCardIds={triggerMap?.[stepId]}/>
            )
        })}
      </div>
    </div>
  )
})