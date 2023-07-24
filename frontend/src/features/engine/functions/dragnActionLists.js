import { ca, el } from "date-fns/locale";

export const dragnActionLists = {
    setRotation: (deg) => (
    [
      ["SET", "/cardById/$ACTIVE_CARD_ID/rotation", deg],
      ["LOG", "$PLAYER_N", " set rotation of ", "$ACTIVE_FACE.name", " to ", deg, "."]
    ]
  ),
  toggleTrigger: (stepId) => (
    [
      ["DEFINE", "$STEP_ID", stepId],
      ["COND",
        "$ACTIVE_FACE.triggers.$STEP_ID",
        [
          ["SET", "/$ACTIVE_FACE_PATH/triggers/" + stepId, false],
          ["LOG", "$PLAYER_N", " removed ", stepId, " trigger to ", "$ACTIVE_FACE.name", "."]
        ],
        true,
        [
          ["SET", "/$ACTIVE_FACE_PATH/triggers/" + stepId, true],
          ["LOG", "$PLAYER_N", " added ", stepId, " trigger to ", "$ACTIVE_FACE.name", "."]
        ]
      ]
    ]
  ),
  targetCard: () => ([
    ["COND",
      ["NOT", "$ACTIVE_CARD.targeting.$PLAYER_N"],
      [
        ["SET", "/cardById/$ACTIVE_CARD_ID/targeting/$PLAYER_N", true],
        ["LOG", "$PLAYER_N", " targeted ", "$ACTIVE_CARD.currentFace.name", "."]
      ],
      true,
      [
        ["SET", "/cardById/$ACTIVE_CARD_ID/targeting/$PLAYER_N", false],
        ["LOG", "$PLAYER_N", " untargeted ", "$ACTIVE_CARD.currentFace.name", "."]
      ]
    ]
  ]),
  setStep: (stepId, stepInfo) => ([
    ["SET", "/stepId", stepId],
    ["LOG", "$PLAYER_N", " set the round step to ", stepInfo?.label, "."]
  ]),
  moveAllStacksTo: (origGroupId, destGroupId, numStacks, position) => ([
    ["MOVE_STACKS", origGroupId, destGroupId, numStacks, position],
    ["COND",
      ["EQUAL", position, "top"],
      ["LOG", "$PLAYER_N", " moved all cards (", numStacks, ") from ", "$GAME.groupById." + origGroupId + ".label", " to top of ", "$GAME.groupById." + destGroupId + ".label", "."],
      ["EQUAL", position, "bottom"],
      ["LOG", "$PLAYER_N", " moved (", numStacks, ") from ", "$GAME.groupById." + origGroupId + ".label", " to bottom of ", "$GAME.groupById." + destGroupId + ".label", "."],
      true,
      ["LOG", "$PLAYER_N", " shuffled all cards (", numStacks, ") from ", "$GAME.groupById." + origGroupId + ".label", " into ", "$GAME.groupById." + destGroupId + ".label", "."]
    ]
  ]),
  moveCardToTop: (cardId, destGroupId, label) => ([
    ["MOVE_CARD", cardId, destGroupId, 0],
    ["LOG", "$PLAYER_N", " moved ", ["FACEUP_NAME_FROM_CARD_ID", cardId], " to top of ", label, "."]
  ]),
  moveCardToShuffled: (cardId, destGroupId, label) => ([
    ["MOVE_CARD", cardId, destGroupId, 0],
    ["SHUFFLE_GROUP", destGroupId],
    ["LOG", "$PLAYER_N", " shuffled ", ["FACEUP_NAME_FROM_CARD_ID", cardId], " into ", label, "."]
  ]),
  moveCardToBottom: (cardId, destGroupId, label) => ([
    ["MOVE_CARD", cardId, destGroupId, -1],
    ["LOG", "$PLAYER_N", " moved ", ["FACEUP_NAME_FROM_CARD_ID", cardId], " to bottom of ", label, "."]
  ]),
  moveCardToTopX: (cardId, destGroupId, label) => ([
    ["INPUT", "integer", "$VAL", "Shuffle into top:", 5],
    ["MOVE_CARD", cardId, destGroupId, 0],
    ["SHUFFLE_TOP_X", destGroupId, "$VAL"],
    ["LOG", "$PLAYER_N", " shuffled ", ["FACEUP_NAME_FROM_CARD_ID", cardId], " into the top ", "$VAL", " cards of ", label, "."]
  ]),
  moveCardToBottomX: (cardId, destGroupId, label) => ([
    ["INPUT", "integer", "$VAL", "Shuffle into bottom:", 5],
    ["MOVE_CARD", cardId, destGroupId, -1],
    ["SHUFFLE_BOTTOM_X", destGroupId, "$VAL"],
    ["LOG", "$PLAYER_N", " shuffled ", ["FACEUP_NAME_FROM_CARD_ID", cardId], " into the bottom ", "$VAL", " cards of ", label, "."]
  ]),
  detach: (card) => ([
    ["COND",
      ["GREATER_THAN", card.cardIndex, 0],
      [
        ["MOVE_CARD", card.id, card.groupId, card.stackIndex + 1, 0],
        ["LOG", "$PLAYER_N", " detached ", ["FACEUP_NAME_FROM_CARD_ID", card.id], "."]
      ]
    ]
  ]),
  flipCard: (card) => ([
    ["COND",
      ["EQUAL", card.currentSide, "A"],
      [
        ["LOG", "$PLAYER_N", " flipped ", ["FACEUP_NAME_FROM_CARD_ID", card.id], " facedown."],
        ["SET", "/cardById/" + card.id + "/currentSide", "B"]
      ],
      true,
      [
        ["SET", "/cardById/" + card.id + "/currentSide", "A"],
        ["LOG", "$PLAYER_N", " flipped ", ["FACEUP_NAME_FROM_CARD_ID", card.id], " faceup."]
      ]
    ]
  ]),
  deleteCard: (card) => ([
    ["LOG", "$PLAYER_N", " deleted ", ["FACEUP_NAME_FROM_CARD_ID", card.id], "."],
    ["DELETE_CARD", card.id]
  ]),
  chooseRandom: (groupId) => ([
    ["DEFINE", "$RANDOM_IDX", ["RANDOM_INT", 0, ["SUBTRACT", ["LENGTH", "$GAME.groupById." + groupId + ".stackIds"], 1]]],
    ["DEFINE", "$STACK_ID", "$GAME.groupById." + groupId + ".stackIds.[$RANDOM_IDX]"],
    ["DEFINE", "$CARD_ID", "$GAME.stackById.$STACK_ID.cardIds.[0]"],
    ["TARGET", "$CARD_ID"],
    ["LOG", "$PLAYER_N", " chose a random card from ", "$GAME.groupById." + groupId + ".label", "."]
  ]),
  togglePeeking: (card, val, playerIList) => {
    if (val === "All") {
      // Make an object where the keys are the playerI and the values are true
      const peeking = playerIList.reduce((obj, playerI) => {
        obj[playerI] = true;
        return obj;
      }
      , {});
      return ([
        ["SET", "/cardById/" + card.id + "/peeking", peeking],
        ["LOG", "$PLAYER_N", " set ", ["FACEUP_NAME_FROM_CARD_ID", card.id], " to be peeked at by all players."]
      ])
    } else if (val === "None") {
      return ([
        ["SET", "/cardById/" + card.id + "/peeking", {}],
        ["LOG", "$PLAYER_N", " set ", ["FACEUP_NAME_FROM_CARD_ID", card.id], " to not be peeked at by any players."]
      ])
    } else {
      const peeking = {...card.peeking, [val]: !card.peeking[val]};
      return ([
        ["SET", "/cardById/" + card.id + "/peeking", peeking],
        card.peeking[val]
          ? ["LOG", "$PLAYER_N", " set ", ["FACEUP_NAME_FROM_CARD_ID", card.id], " to not be peeked at by {", val, "}."]
          : ["LOG", "$PLAYER_N", " set ", ["FACEUP_NAME_FROM_CARD_ID", card.id], " to be peeked at by {", val + "}", "."]
      ])
    }
  }
}
  