import React from "react";
import { faArrowUp, faArrowDown, faRandom, faChevronRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DropdownItem, GoBack } from "./DropdownMenuHelpers";
import "../../css/custom-dropdown.css";
import { useSelector } from "react-redux";
import { useGameL10n } from "./hooks/useGameL10n";
import { useGameDefinition } from "./hooks/useGameDefinition";
import { usePlayerIList } from "./hooks/usePlayerIList";
import { useBrowseTopN } from "./hooks/useBrowseTopN";
import { dragnActionLists } from "./functions/dragnActionLists";

export const DropdownMenuGroup = React.memo(({
  mouseX,
  mouseY,
  menuHeight,
  handleDropdownClick,
  calcHeight,
  activeMenu,
}) => {
  const gameL10n = useGameL10n();
  const dropdownMenu = useSelector(state => state?.playerUi?.dropdownMenu);
  const playerN = useSelector(state => state?.playerUi?.playerN);
  const playerIList = usePlayerIList();
  const menuGroup = dropdownMenu.group;
  const gameDef = useGameDefinition();
  const group = useSelector(state => state?.gameUi?.game?.groupById?.[menuGroup.id]);
  const browseTopN = useBrowseTopN();

  console.log("Rendering DMGroup", group)
  const DropdownMoveTo = (props) => {
    return (
      <div className="menu">
        <GoBack goToMenu="moveTo" clickCallback={handleDropdownClick}/>
        <DropdownItem
          leftIcon={<FontAwesomeIcon icon={faArrowUp}/>}
          action="moveStacks"
          destGroupId={props.destGroupId}
          position="top"
          clickCallback={handleDropdownClick}>
          {gameL10n("Top")}
        </DropdownItem>
        <DropdownItem
          leftIcon={<FontAwesomeIcon icon={faRandom}/>}
          action="moveStacks"
          destGroupId={props.destGroupId}
          position="shuffle"
          clickCallback={handleDropdownClick}>
          {gameL10n("Shuffle in")}
        </DropdownItem>
        <DropdownItem
          leftIcon={<FontAwesomeIcon icon={faArrowDown}/>}
          action="moveStacks"
          destGroupId={props.destGroupId}
          position="bottom"
          clickCallback={handleDropdownClick}>
          {gameL10n("Bottom")}
        </DropdownItem>
      </div>
    )
  }

  const left = mouseX < (window.innerWidth/2)  ? mouseX : mouseX -300;
  const top = mouseY < (window.innerHeight/2) ? mouseY : mouseY -300;

  const actionListShuffle = [
    ["SHUFFLE_GROUP", menuGroup.id],
    ["LOG", "$PLAYER_N", " shuffled ", group.name]
  ]

  const handleLookAtClick = (dropdownOptions) => {
    browseTopN(menuGroup.id, dropdownOptions.topN);
  }
  

  return (
    <div 
      className="dropdown" 
      style={{ height: menuHeight, zIndex: 1e7, top: top, left: left }}>
        <div className="menu-title">{dropdownMenu.title}</div>
        {activeMenu === "main" &&
        <div className="menu">
          <DropdownItem action={actionListShuffle} clickCallback={handleDropdownClick}>{gameL10n("Shuffle")}</DropdownItem>
          {group?.menuOptions?.map((option, _index) => {
            return(
              <DropdownItem action={option.actionList} clickCallback={handleDropdownClick}>{gameL10n(option.label)}</DropdownItem>
            )
          })}
          {gameDef?.groupMenu?.options?.map((option, _index) => {
            return(
              <DropdownItem action={option.actionList} clickCallback={handleDropdownClick}>{gameL10n(option.label)}</DropdownItem>
            )
          })}
          {menuGroup.id === playerN+"Hand" ? <DropdownItem action="makeVisible" clickCallback={handleDropdownClick}>{gameL10n("Make visible/hidden")}</DropdownItem> : null}
          
          <DropdownItem topN="None" clickCallback={handleLookAtClick}>{gameL10n("Browse")}</DropdownItem>
          <DropdownItem topN="5" clickCallback={handleLookAtClick}>{gameL10n("Look at top 5")}</DropdownItem>
          <DropdownItem topN="10" clickCallback={handleLookAtClick}>{gameL10n("Look at top 10")}</DropdownItem>
          <DropdownItem topN="X" clickCallback={handleLookAtClick}>{gameL10n("Look at top X")}</DropdownItem>
          <DropdownItem action={dragnActionLists.chooseRandom(menuGroup.id)} clickCallback={handleDropdownClick}>{gameL10n("Choose Random")}</DropdownItem>
          <DropdownItem action="dealX" side="B" clickCallback={handleDropdownClick}>{gameL10n("Deal top X facedown")}</DropdownItem>
          <DropdownItem
            rightIcon={<FontAwesomeIcon icon={faChevronRight}/>}
            goToMenu="setVisibility"
            clickCallback={handleDropdownClick}>
            {gameL10n("Set visibility")}
          </DropdownItem>
          <DropdownItem
            rightIcon={<FontAwesomeIcon icon={faChevronRight}/>}
            goToMenu="moveTo"
            clickCallback={handleDropdownClick}>
            {gameL10n("Move to")}
          </DropdownItem>
          {/* <DropdownItem
            rightIcon={<FontAwesomeIcon icon={faChevronRight}/>}
            goToMenu="more"
            clickCallback={handleDropdownClick}>
            {l10n("More")}
          </DropdownItem> */}
        </div>}

        {activeMenu === "moveTo" &&
          <div className="menu">
            <GoBack goToMenu="main" clickCallback={handleDropdownClick}/>
            <DropdownItem
              rightIcon={<FontAwesomeIcon icon={faChevronRight}/>}
              goToMenu="moveToMy"
              clickCallback={handleDropdownClick}>
              {gameL10n("My Deck")}
            </DropdownItem>
            {gameDef.moveToGroupIds.map((moveToGroupId, _moveToGroupIndex) => (
              <DropdownItem
                rightIcon={<FontAwesomeIcon icon={faChevronRight}/>}
                goToMenu={"moveTo"+moveToGroupId}
                clickCallback={handleDropdownClick}>
                {gameL10n(gameDef?.groups?.[moveToGroupId]?.name)}
              </DropdownItem>
              ))}
        </div>
        }
        {activeMenu === "setVisibility" &&
          <div className="menu">
            <GoBack goToMenu="main" clickCallback={handleDropdownClick}/>
            <DropdownItem
              leftIcon={null}
              action={"setVisibility"}
              value="none"
              clickCallback={handleDropdownClick}>
              {gameL10n("None")}
            </DropdownItem>
            {playerIList.map((playerI, _index) => {
              return(
                <DropdownItem
                  rightIcon={<FontAwesomeIcon icon={group?.defaultPeeking?.includes(playerI) ? faCheck : null}/>}
                  action={"setVisibility"}
                  value={playerI}
                  clickCallback={handleDropdownClick}>
                  {gameL10n(playerI)}
                </DropdownItem>
              )
            })}
            <DropdownItem
              leftIcon={null}
              action={"setVisibility"}
              position="all"
              clickCallback={handleDropdownClick}>
              {gameL10n("All")}
            </DropdownItem>
        </div>
        }
        {activeMenu === "moveToMy" &&
        <DropdownMoveTo destGroupId={playerN+"Deck"}/>}
        {gameDef?.groupMenu?.moveToGroupIds.map((moveToGroupId, _moveToGroupIndex) => (
          (activeMenu === "moveTo" + moveToGroupId) && <DropdownMoveTo destGroupId={moveToGroupId}/>
        ))}
    </div>
  );
})