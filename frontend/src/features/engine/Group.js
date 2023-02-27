import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Stacks } from "./Stacks";
import { faBars, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useBrowseTopN } from "./functions/useBrowseTopN"; 
import { setDropdownMenuObj } from "../store/playerUiSlice";
import { useGameL10n } from "../../hooks/useGameL10n";
import { useGameDefinition } from "./functions/useGameDefinition";

export const Group = React.memo(({
  groupId,
  groupType,
  hideTitle,
  registerDivToArrowsContext
}) => {
  console.log("Rendering Group ",groupId, hideTitle);
  const dispatch = useDispatch();
  const l10n = useGameL10n();
  const gameDef = useGameDefinition();
  const group = useSelector(state => state?.gameUi?.game?.groupById?.[groupId]);
  const playerN = useSelector(state => state?.playerUi?.playerN);
  const browseTopN = useBrowseTopN();

  const handleEyeClick = (event) => {
    event.stopPropagation();
    browseTopN(groupId, "All");
  }

  const handleBarsClick = (event) => {
    event.stopPropagation();
    if (!playerN) return;
    const dropdownMenuObj = {
        type: "group",
        group: group,
        title: gameDef.groups[groupId].name,
    }
    console.log("dispatch setDropdownMenuObj", dropdownMenuObj)
    if (playerN) dispatch(setDropdownMenuObj(dropdownMenuObj));
  }

  if (!group) return null;
  const numStacks = group.stackIds.length;
  const tablename = gameDef.groups[group.id].tableName;
  return(
    <div className="h-full w-full">
      {hideTitle ? null :
        <div
          className="relative h-full float-left select-none text-gray-500"
          style={{width:"17px"}}>
            <div className="relative w-full h-full">
              <span 
                className="absolute mt-1" 
                style={{fontSize: "1.7vh", top: tablename === "Encounter" ? "55%" : "50%", left: "50%", transform: `translate(-50%, -40%) rotate(90deg)`, whiteSpace: "nowrap"}}>
                {playerN && <FontAwesomeIcon onClick={(event) => handleEyeClick(event)}  className="hover:text-white mr-2" style={{transform: `rotate(-90deg)`}} icon={faEye}/>}
                {playerN && <FontAwesomeIcon onClick={(event) => handleBarsClick(event)}  className="hover:text-white mr-2" style={{transform: `rotate(-90deg)`}} icon={faBars}/>}
                  {l10n(tablename) + (groupType === "pile" ? " ("+numStacks+")" : "")}
              </span>
            </div>
        </div>
      }
      <Stacks
        groupId={group.id}
        groupType={group.type}
        selectedStackIndices={[...Array(numStacks).keys()]}
        registerDivToArrowsContext={registerDivToArrowsContext}
      />
    </div>
  )
})