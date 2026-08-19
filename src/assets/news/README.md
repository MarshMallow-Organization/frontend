# News Assets

뉴스 화면에서 저장소에 포함해 사용하는 로컬 이미지다.

- `raw-image-3.png`: 현재 뉴스 목업의 임시 대표 이미지

Figma의 만료 가능한 임시 URL을 런타임에서 직접 사용하지 않는다. 실제 API 이미지와 로컬 fallback의 책임을 구분하고, 임시 asset을 제거하거나 교체할 때 `NewsPage`의 참조도 함께 확인한다.
