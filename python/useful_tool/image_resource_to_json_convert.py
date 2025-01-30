import os
import json
from enum import Enum

current_directory = os.getcwd()
print(f"Current working directory: {current_directory}")

class WillBeReferenceImageLocation(Enum):
    CARD = "resource/battle_field_unit/card/"
    SWORD_POWER = "resource/battle_field_unit/sword_power/"
    STAFF_POWER = "resource/battle_field_unit/staff_power/"
    HP = "resource/battle_field_unit/hp/"
    ENERGY = "resource/battle_field_unit/energy/"
    RACE = "resource/card_race/"
    BACKGROUND = "resource/background/"
    MAIN_LOBBY_BACKGROUND = "resource/main_lobby/"
    MAIN_LOBBY_BUTTONS = "resource/main_lobby/buttons/"
    SHOP_BACKGROUND = "resource/shop/"
    SHOP_BUTTONS = "resource/shop/buttons/"
    SHOP_SELECT_SCREENS = "resource/shop/select_screen/"
    SHOP_YES_OR_NO_BUTTON = "resource/shop/yes_or_no/"
    SELECT_CARD_SCREEN = "resource/shop/background/"
    TRY_AGAIN_SCREEN = "resource/select_card_result_screen/try_again_screen/"
    TRY_AGAIN_BUTTONS = "resource/select_card_result_screen/try_again_buttons"
    BATTLE_FIELD_BACKGROUND = "resource/battle_field/background/"
    MY_CARD_BACKGROUND = "resource/my_card/background/"
    MY_CARD_PAGE_MOVEMENT_BUTTON = "resource/my_card/page_movement_button"
    MY_DECK_BACKGROUND = "resource/my_deck/"
    MY_DECK_BUTTONS = "resource/my_deck/my_deck_buttons/"
    DECK_PAGE_MOVEMENT_BUTTONS = "resource/my_deck/deck_page_movement_button/"
    DECK_CARD_PAGE_MOVEMENT_BUTTONS = "resource/my_deck/card_page_movement_button/"
    CARD_KINDS = "resource/card_kinds/"
    DECK_MAKING_POP_UP_BACKGROUND = "resource/deck_making_pop_up/background/"
    DECK_MAKING_POP_UP_BUTTONS = "resource/deck_making_pop_up/buttons/"
    MAKE_DECK_BACKGROUND = "resource/make_deck/background/"
    OWNED_CARD = "resource/my_card/card/"
    RACE_BUTTON = "resource/make_deck/race_button/"
    RACE_BUTTON_EFFECT = "resource/make_deck/race_button_effect/"

class RelativeImageLocation(Enum):
    CARD = "../../resource/battle_field_unit/card/"
    SWORD_POWER = "../../resource/battle_field_unit/sword_power/"
    STAFF_POWER = "../../resource/battle_field_unit/staff_power/"
    HP = "../../resource/battle_field_unit/hp/"
    ENERGY = "../../resource/battle_field_unit/energy/"
    RACE = "../../resource/card_race/"
    BACKGROUND = "../../resource/background/"
    MAIN_LOBBY_BACKGROUND = "../../resource/main_lobby/"
    MAIN_LOBBY_BUTTONS = "../../resource/main_lobby/buttons/"
    SHOP_BACKGROUND = "../../resource/shop/"
    SHOP_BUTTONS = "../../resource/shop/buttons/"
    SHOP_SELECT_SCREENS = "../../resource/shop/select_screen/"
    SHOP_YES_OR_NO_BUTTON = "../../resource/shop/yes_or_no/"
    SELECT_CARD_SCREEN = "../../resource/shop/background/"
    TRY_AGAIN_SCREEN = "../../resource/select_card_result_screen/try_again_screen"
    TRY_AGAIN_BUTTONS = "../../resource/select_card_result_screen/try_again_buttons"
    BATTLE_FIELD_BACKGROUND = "../../resource/battle_field/background/"
    MY_CARD_BACKGROUND = "../../resource/my_card/background/"
    MY_CARD_PAGE_MOVEMENT_BUTTON = "../../resource/my_card/page_movement_button"
    MY_DECK_BACKGROUND = "../../resource/my_deck/"
    MY_DECK_BUTTONS = "../../resource/my_deck/my_deck_buttons/"
    DECK_PAGE_MOVEMENT_BUTTONS = "../../resource/my_deck/deck_page_movement_button/"
    DECK_CARD_PAGE_MOVEMENT_BUTTONS = "../../resource/my_deck/card_page_movement_button/"
    CARD_KINDS = "../../resource/card_kinds/"
    DECK_MAKING_POP_UP_BACKGROUND = "../../resource/deck_making_pop_up/background/"
    DECK_MAKING_POP_UP_BUTTONS = "../../resource/deck_making_pop_up/buttons/"
    MAKE_DECK_BACKGROUND = "../../resource/make_deck/background/"
    OWNED_CARD = "../../resource/my_card/card/"
    RACE_BUTTON = "../../resource/make_deck/race_button/"
    RACE_BUTTON_EFFECT = "../../resource/make_deck/race_button_effect/"

# 디렉토리 경로 설정
relative_paths = {
    RelativeImageLocation.CARD: RelativeImageLocation.CARD.value,
    RelativeImageLocation.SWORD_POWER: RelativeImageLocation.SWORD_POWER.value,
    RelativeImageLocation.STAFF_POWER: RelativeImageLocation.STAFF_POWER.value,
    RelativeImageLocation.HP: RelativeImageLocation.HP.value,
    RelativeImageLocation.ENERGY: RelativeImageLocation.ENERGY.value,
    RelativeImageLocation.RACE: RelativeImageLocation.RACE.value,
    RelativeImageLocation.BACKGROUND: RelativeImageLocation.BACKGROUND.value,
    RelativeImageLocation.MAIN_LOBBY_BACKGROUND: RelativeImageLocation.MAIN_LOBBY_BACKGROUND.value,
    RelativeImageLocation.MAIN_LOBBY_BUTTONS: RelativeImageLocation.MAIN_LOBBY_BUTTONS.value,
    RelativeImageLocation.SHOP_BACKGROUND: RelativeImageLocation.SHOP_BACKGROUND.value,
    RelativeImageLocation.SHOP_BUTTONS: RelativeImageLocation.SHOP_BUTTONS.value,
    RelativeImageLocation.SHOP_SELECT_SCREENS: RelativeImageLocation.SHOP_SELECT_SCREENS.value,
    RelativeImageLocation.SHOP_YES_OR_NO_BUTTON: RelativeImageLocation.SHOP_YES_OR_NO_BUTTON.value,
    RelativeImageLocation.SELECT_CARD_SCREEN: RelativeImageLocation.SELECT_CARD_SCREEN.value,
    RelativeImageLocation.TRY_AGAIN_SCREEN: RelativeImageLocation.TRY_AGAIN_SCREEN.value,
    RelativeImageLocation.TRY_AGAIN_BUTTONS: RelativeImageLocation.TRY_AGAIN_BUTTONS.value,
    RelativeImageLocation.BATTLE_FIELD_BACKGROUND: RelativeImageLocation.BATTLE_FIELD_BACKGROUND.value,
    RelativeImageLocation.MY_CARD_BACKGROUND: RelativeImageLocation.MY_CARD_BACKGROUND.value,
    RelativeImageLocation.MY_CARD_PAGE_MOVEMENT_BUTTON: RelativeImageLocation.MY_CARD_PAGE_MOVEMENT_BUTTON.value,
    RelativeImageLocation.MY_DECK_BACKGROUND: RelativeImageLocation.MY_DECK_BACKGROUND.value,
    RelativeImageLocation.MY_DECK_BUTTONS: RelativeImageLocation.MY_DECK_BUTTONS.value,
    RelativeImageLocation.DECK_PAGE_MOVEMENT_BUTTONS: RelativeImageLocation.DECK_PAGE_MOVEMENT_BUTTONS.value,
    RelativeImageLocation.DECK_CARD_PAGE_MOVEMENT_BUTTONS: RelativeImageLocation.DECK_CARD_PAGE_MOVEMENT_BUTTONS.value,
    RelativeImageLocation.CARD_KINDS: RelativeImageLocation.CARD_KINDS.value,
    RelativeImageLocation.DECK_MAKING_POP_UP_BACKGROUND: RelativeImageLocation.DECK_MAKING_POP_UP_BACKGROUND.value,
    RelativeImageLocation.DECK_MAKING_POP_UP_BUTTONS: RelativeImageLocation.DECK_MAKING_POP_UP_BUTTONS.value,
    RelativeImageLocation.MAKE_DECK_BACKGROUND: RelativeImageLocation.MAKE_DECK_BACKGROUND.value,
    RelativeImageLocation.OWNED_CARD: RelativeImageLocation.OWNED_CARD.value,
    RelativeImageLocation.RACE_BUTTON: RelativeImageLocation.RACE_BUTTON.value,
    RelativeImageLocation.RACE_BUTTON_EFFECT: RelativeImageLocation.RACE_BUTTON_EFFECT.value,
}

reference_paths = {
    WillBeReferenceImageLocation.CARD: WillBeReferenceImageLocation.CARD.value,
    WillBeReferenceImageLocation.SWORD_POWER: WillBeReferenceImageLocation.SWORD_POWER.value,
    WillBeReferenceImageLocation.STAFF_POWER: WillBeReferenceImageLocation.STAFF_POWER.value,
    WillBeReferenceImageLocation.HP: WillBeReferenceImageLocation.HP.value,
    WillBeReferenceImageLocation.ENERGY: WillBeReferenceImageLocation.ENERGY.value,
    WillBeReferenceImageLocation.RACE: WillBeReferenceImageLocation.RACE.value,
    WillBeReferenceImageLocation.BACKGROUND: WillBeReferenceImageLocation.BACKGROUND.value,
    WillBeReferenceImageLocation.MAIN_LOBBY_BACKGROUND: WillBeReferenceImageLocation.MAIN_LOBBY_BACKGROUND.value,
    WillBeReferenceImageLocation.MAIN_LOBBY_BUTTONS: WillBeReferenceImageLocation.MAIN_LOBBY_BUTTONS.value,
    WillBeReferenceImageLocation.SHOP_BACKGROUND: WillBeReferenceImageLocation.SHOP_BACKGROUND.value,
    WillBeReferenceImageLocation.SHOP_BUTTONS: WillBeReferenceImageLocation.SHOP_BUTTONS.value,
    WillBeReferenceImageLocation.SHOP_SELECT_SCREENS: WillBeReferenceImageLocation.SHOP_SELECT_SCREENS.value,
    WillBeReferenceImageLocation.SHOP_YES_OR_NO_BUTTON: WillBeReferenceImageLocation.SHOP_YES_OR_NO_BUTTON.value,
    WillBeReferenceImageLocation.SELECT_CARD_SCREEN: WillBeReferenceImageLocation.SELECT_CARD_SCREEN.value,
    WillBeReferenceImageLocation.TRY_AGAIN_SCREEN: WillBeReferenceImageLocation.TRY_AGAIN_SCREEN.value,
    WillBeReferenceImageLocation.TRY_AGAIN_BUTTONS: WillBeReferenceImageLocation.TRY_AGAIN_BUTTONS.value,
    WillBeReferenceImageLocation.BATTLE_FIELD_BACKGROUND: WillBeReferenceImageLocation.BATTLE_FIELD_BACKGROUND.value,
    WillBeReferenceImageLocation.MY_CARD_BACKGROUND: WillBeReferenceImageLocation.MY_CARD_BACKGROUND.value,
    WillBeReferenceImageLocation.MY_CARD_PAGE_MOVEMENT_BUTTON: WillBeReferenceImageLocation.MY_CARD_PAGE_MOVEMENT_BUTTON.value,
    WillBeReferenceImageLocation.MY_DECK_BACKGROUND: WillBeReferenceImageLocation.MY_DECK_BACKGROUND.value,
    WillBeReferenceImageLocation.MY_DECK_BUTTONS: WillBeReferenceImageLocation.MY_DECK_BUTTONS.value,
    WillBeReferenceImageLocation.DECK_PAGE_MOVEMENT_BUTTONS: WillBeReferenceImageLocation.DECK_PAGE_MOVEMENT_BUTTONS.value,
    WillBeReferenceImageLocation.DECK_CARD_PAGE_MOVEMENT_BUTTONS: WillBeReferenceImageLocation.DECK_CARD_PAGE_MOVEMENT_BUTTONS.value,
    WillBeReferenceImageLocation.CARD_KINDS: WillBeReferenceImageLocation.CARD_KINDS.value,
    WillBeReferenceImageLocation.DECK_MAKING_POP_UP_BACKGROUND: WillBeReferenceImageLocation.DECK_MAKING_POP_UP_BACKGROUND.value,
    WillBeReferenceImageLocation.DECK_MAKING_POP_UP_BUTTONS: WillBeReferenceImageLocation.DECK_MAKING_POP_UP_BUTTONS.value,
    WillBeReferenceImageLocation.MAKE_DECK_BACKGROUND: WillBeReferenceImageLocation.MAKE_DECK_BACKGROUND.value,
    WillBeReferenceImageLocation.OWNED_CARD: WillBeReferenceImageLocation.OWNED_CARD.value,
    WillBeReferenceImageLocation.RACE_BUTTON: WillBeReferenceImageLocation.RACE_BUTTON.value,
    WillBeReferenceImageLocation.RACE_BUTTON_EFFECT: WillBeReferenceImageLocation.RACE_BUTTON_EFFECT.value,
}

image_paths = {
    "card": [],
    "sword_power": [],
    "staff_power": [],
    "hp": [],
    "energy": [],
    "race": [],
    "background": [],
    "main_lobby_background": [],
    "main_lobby_buttons": [],
    "shop_background": [],
    "shop_buttons": [],
    "shop_select_screens": [],
    "shop_yes_or_no_button": [],
    "select_card_screen": [],
    "try_again_screen": [],
    "try_again_buttons": [],
    "battle_field_background": [],
    "my_card_background": [],
    "my_card_page_movement_button": [],
    "my_deck_background": [],
    "my_deck_buttons": [],
    "deck_page_movement_buttons": [],
    "deck_card_page_movement_buttons": [],
    "card_kinds": [],
    "deck_making_pop_up_background": [],
    "deck_making_pop_up_buttons": [],
    "make_deck_background": [],
    "owned_card": [],
    "race_button": [],
    "race_button_effect": [],
}

for category, dir_path in relative_paths.items():
    reference_path_category = WillBeReferenceImageLocation[category.name].value
    for file_name in os.listdir(dir_path):
        if file_name.endswith(".png"):
            reference_path = os.path.join(reference_path_category, file_name)
            image_paths[category.name.lower()].append(reference_path)

# JSON 파일로 저장
with open('image-paths.json', 'w', encoding='utf-8') as json_file:
    json.dump(image_paths, json_file, ensure_ascii=False, indent=4)

print("Image paths saved to image-paths.json")
