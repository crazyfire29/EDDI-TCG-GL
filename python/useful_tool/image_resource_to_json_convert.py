import os
import json
from enum import Enum

current_directory = os.getcwd()
print(f"Current working directory: {current_directory}")

class WillBeReferenceImageLocation(Enum):
    CARD = "resource/battle_field_unit/card/"
    WEAPON = "resource/battle_field_unit/sword_power/"
    HP = "resource/battle_field_unit/hp/"
    ENERGY = "resource/battle_field_unit/energy/"
    RACE = "resource/card_race/"
    BACKGROUND = "resource/background/"

class RelativeImageLocation(Enum):
    CARD = "../../resource/battle_field_unit/card/"
    WEAPON = "../../resource/battle_field_unit/sword_power/"
    HP = "../../resource/battle_field_unit/hp/"
    ENERGY = "../../resource/battle_field_unit/energy/"
    RACE = "../../resource/card_race/"
    BACKGROUND = "../../resource/background/"

# 디렉토리 경로 설정
paths = {
    RelativeImageLocation.CARD: RelativeImageLocation.CARD.value,
    RelativeImageLocation.WEAPON: RelativeImageLocation.WEAPON.value,
    RelativeImageLocation.HP: RelativeImageLocation.HP.value,
    RelativeImageLocation.ENERGY: RelativeImageLocation.ENERGY.value,
    RelativeImageLocation.RACE: RelativeImageLocation.RACE.value,
    RelativeImageLocation.BACKGROUND: RelativeImageLocation.BACKGROUND.value
}

image_paths = {}

for category, dir_path in paths.items():
    image_paths[category.name.lower()] = []
    for file_name in os.listdir(dir_path):
        if file_name.endswith(".png"):
            relative_path = os.path.join(dir_path, file_name)
            reference_path = os.path.join(WillBeReferenceImageLocation[category.name].value, file_name)
            image_paths[category.name.lower()].append({
                "relative_path": relative_path,
                "reference_path": reference_path
            })

# JSON 파일로 저장
with open('image-paths.json', 'w', encoding='utf-8') as json_file:
    json.dump(image_paths, json_file, ensure_ascii=False, indent=4)

print("Image paths saved to image-paths.json")
