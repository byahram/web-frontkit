export interface ComponentPropSpec {
  name: string;
  type: "select" | "boolean" | "text" | "number";
  options?: string[];
  defaultValue: any;
  description: string;
}

export interface ComponentSpec {
  id: string;
  name: string;
  category: "atoms" | "molecules" | "organisms" | "templates" | "pages";
  description: string;
  props: ComponentPropSpec[];
  codeTemplate: (props: any) => string;
}

export interface GuideSpec {
  id: string;
  title: string;
  category: "guide";
  description: string;
  content: string; // Markdown or rich text representation
}

export const mockGuides: GuideSpec[] = [
  {
    id: "convention",
    title: "Convention",
    category: "guide",
    description: "Atomic Design 및 코드 작성 스타일 가이드라인",
    content: `
# Code & Design Conventions

우리의 프론트엔드 프로젝트는 **Atomic Design** 방법론을 차용하며, 컴포넌트의 책임을 명확히 분리하고 재사용성을 극대화하는 것을 목적으로 합니다.

## 1. Directory Structure

프로젝트 내 모든 UI 컴포넌트는 \`components/\` 디렉토리 하위에 아토믹 레이어별로 배치됩니다.

*   **Atoms**: 더 이상 쪼갤 수 없는 기본 단위 (Button, Input, Badge, Icon 등)
*   **Molecules**: Atom들의 조합으로 특정 기능을 수행하는 단위 (SearchInput, Card, FormItem 등)
*   **Organisms**: Molecule과 Atom들의 조합으로 구성된 완성도 높은 영역 (Header, Sidebar, Table 등)
*   **Templates**: 페이지 레이아웃 골격. 실제 데이터는 다루지 않고 영역만 정의
*   **Pages**: 실제 비즈니스 로직과 API 데이터가 바인딩되는 최종 화면

## 2. Naming Conventions

*   **파일 및 폴더명**: 파스칼 케이스(PascalCase) 사용 (예: \`Button.tsx\`, \`PrimaryButton/\`)
*   **함수 및 변수명**: 카멜 케이스(camelCase) 사용
*   **컴포넌트 선언**: \`export const ComponentName = ...\` 형태의 Named Export 지향
*   **CSS Class명**: Tailwind CSS를 사용하므로 컴포넌트 코드 내에서 유틸리티 클래스로 지정

## 3. TypeScript Rules

*   컴포넌트의 Props는 항상 \`interface\`를 통해 명시적으로 타입을 선언합니다.
*   \`React.HTMLAttributes\`나 \`React.ButtonHTMLAttributes\` 등 브라우저 내장 엘리먼트 속성을 확장하여 기본 이벤트 핸들러를 그대로 지원합니다.
`
  },
  {
    id: "git-strategy",
    title: "Git Strategy",
    category: "guide",
    description: "협업과 릴리즈를 위한 Git 브랜치 및 커밋 컨벤션",
    content: `
# Git Branch & Commit Strategy

효율적이고 안전한 코드 협업을 위해 Git Flow 기반의 브랜치 전략과 커밋 메시지 규칙을 엄격히 적용합니다.

## 1. Branch Structure

*   \`main\`: 운영 서버에 배포되는 가장 안정적인 프로덕션 브랜치
*   \`develop\`: 다음 릴리즈를 위해 개발을 통합하는 기준 브랜치
*   \`feature/{issue-number}-{summary}\`: 신규 기능 개발 브랜치 (예: \`feature/12-sidebar-ui\`)
*   \`fix/{issue-number}-{summary}\`: 버그 수정 브랜치
*   \`refactor/{issue-number}-{summary}\`: 리팩토링 브랜치

## 2. Commit Message Template

커밋 메시지는 아래와 같이 **[타입] 제목** 형태로 영문 또는 국문 작성을 원칙으로 합니다:

\`\`\`bash
feat: Add search command palette with Cmd+K shortcut
fix: Correct layout shifts on mobile sidebars
docs: Document lint rules and pre-commit checks
refactor: Clean up redundant tailwind classes in ComponentViewer
\`\`\`

### 주요 Type 분류
*   \`feat\`: 새로운 기능 추가
*   \`fix\`: 버그 수정
*   \`docs\`: 문서 변경
*   \`style\`: 코드 포맷 변경 (세미콜론 누락, 포맷팅 등)
*   \`refactor\`: 코드 리팩토링 (로직 변경 없음)
*   \`test\`: 테스트 추가 및 수정
*   \`chore\`: 빌드 과정 또는 설정 파일 수정
`
  },
  {
    id: "lint-rules",
    title: "Lint Rules",
    category: "guide",
    description: "코드 품질 향상을 위한 ESLint 및 Prettier 설정 규칙",
    content: `
# Linting & Formatting Rules

일관된 코드 포맷 유지와 코드 에러 사전 차단을 위해 ESLint 및 Prettier 규칙을 강제합니다.

## 1. ESLint Core Rules

*   **no-unused-vars**: 사용하지 않는 변수는 경고 또는 에러 처리 (단, \`_\`로 시작하는 변수는 예외)
*   **react-hooks/rules-of-hooks**: 리액트 훅 호출 규칙 엄격히 준수 (루프나 조건문 내부 호출 금지)
*   **react/self-closing-comp**: 자식 노드가 없는 React 컴포넌트는 셀프 클로징 태그 사용 (\`<div />\` 또는 \`<Button />\`)
*   **@typescript-eslint/no-explicit-any**: 코드 안정성을 위해 \`any\` 타입 사용을 지양하고 구체적인 타입을 사용합니다.

## 2. Prettier Formatter Config

*   **Single Quotes**: \`true\` (따옴표는 \`'\` 사용)
*   **Semi-colons**: \`true\` (문장 끝 세미콜론 필수로 삽입)
*   **Tab Width**: \`2\` (들여쓰기 2칸 공백)
*   **Print Width**: \`100\` (한 줄 최대 길이 100자 제한)
*   **Trailing Comma**: \`all\` (배열 및 객체 끝에 콤마 항상 삽입)
`
  }
];

export const mockComponents: ComponentSpec[] = [
  {
    id: "button",
    name: "Button",
    category: "atoms",
    description: "가장 기본적인 인터랙티브 요소로, 클릭 시 특정 동작이나 이벤트를 실행합니다.",
    props: [
      {
        name: "variant",
        type: "select",
        options: ["primary", "secondary", "outline", "ghost", "danger"],
        defaultValue: "primary",
        description: "버튼의 스타일 외형을 결정합니다."
      },
      {
        name: "size",
        type: "select",
        options: ["sm", "md", "lg"],
        defaultValue: "md",
        description: "버튼의 크기를 조절합니다."
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
        description: "활성화 여부를 선택합니다."
      },
      {
        name: "isLoading",
        type: "boolean",
        defaultValue: false,
        description: "로딩 상태 아이콘을 표시합니다."
      },
      {
        name: "children",
        type: "text",
        defaultValue: "Click me",
        description: "버튼 내부에 들어갈 텍스트 또는 컴포넌트입니다."
      }
    ],
    codeTemplate: (props) => {
      const { variant, size, disabled, isLoading, children } = props;
      return `<Button\n  variant="${variant}"\n  size="${size}"${disabled ? "\n  disabled" : ""}${isLoading ? "\n  isLoading" : ""}\n>\n  ${children}\n</Button>`;
    }
  },
  {
    id: "badge",
    name: "Badge",
    category: "atoms",
    description: "메타데이터, 상태 정보 혹은 수치를 사용자에게 즉각 노출하는 소형 태그입니다.",
    props: [
      {
        name: "variant",
        type: "select",
        options: ["default", "success", "warning", "error", "outline"],
        defaultValue: "default",
        description: "배지의 상태 유형에 따른 색상을 설정합니다."
      },
      {
        name: "size",
        type: "select",
        options: ["sm", "md"],
        defaultValue: "md",
        description: "배지 크기입니다."
      },
      {
        name: "children",
        type: "text",
        defaultValue: "New Component",
        description: "배지 텍스트 내용입니다."
      }
    ],
    codeTemplate: (props) => {
      const { variant, size, children } = props;
      return `<Badge variant="${variant}" size="${size}">\n  ${children}\n</Badge>`;
    }
  },
  {
    id: "input",
    name: "Input",
    category: "atoms",
    description: "텍스트 형식의 데이터를 입력받는 기본 폼 필드입니다.",
    props: [
      {
        name: "label",
        type: "text",
        defaultValue: "User ID",
        description: "입력란 상단에 나타날 라벨명입니다."
      },
      {
        name: "placeholder",
        type: "text",
        defaultValue: "Enter your username",
        description: "플레이스홀더 문구입니다."
      },
      {
        name: "type",
        type: "select",
        options: ["text", "password", "email", "number"],
        defaultValue: "text",
        description: "인풋의 HTML 타입을 정의합니다."
      },
      {
        name: "error",
        type: "text",
        defaultValue: "",
        description: "에러 메시지를 제공하여 경고 상태를 활성화합니다."
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
        description: "인풋 비활성화 처리 여부입니다."
      }
    ],
    codeTemplate: (props) => {
      const { label, placeholder, type, error, disabled } = props;
      return `<Input\n  type="${type}"\n  label="${label}"\n  placeholder="${placeholder}"${error ? `\n  error="${error}"` : ""}${disabled ? "\n  disabled" : ""}\n/>`;
    }
  },
  {
    id: "card",
    name: "Card",
    category: "molecules",
    description: "관련 있는 콘텐츠, 작업, 이미지 등을 일관성 있는 레이아웃의 박스로 묶어 노출합니다.",
    props: [
      {
        name: "title",
        type: "text",
        defaultValue: "Premium Cards UI",
        description: "카드의 주 제목입니다."
      },
      {
        name: "description",
        type: "text",
        defaultValue: "Card components are highly versatile. Perfect for layouts, dashboard items, and showcase items.",
        description: "카드 상세 설명 문장입니다."
      },
      {
        name: "showBadge",
        type: "boolean",
        defaultValue: true,
        description: "카드 우측 상단에 태그 배지 노출 여부입니다."
      },
      {
        name: "badgeText",
        type: "text",
        defaultValue: "Popular",
        description: "표시할 배지 텍스트입니다."
      },
      {
        name: "buttonText",
        type: "text",
        defaultValue: "Explore Details",
        description: "하단 액션 버튼의 텍스트입니다."
      }
    ],
    codeTemplate: (props) => {
      const { title, description, showBadge, badgeText, buttonText } = props;
      return `<Card\n  title="${title}"\n  description="${description}"${showBadge ? `\n  badgeText="${badgeText}"` : ""}\n  buttonText="${buttonText}"\n/>`;
    }
  }
];

export type SearchItem =
  | { type: "component"; id: string; name: string; category: string; description: string }
  | { type: "guide"; id: string; name: string; category: string; description: string };

export const searchItems: SearchItem[] = [
  ...mockGuides.map(g => ({
    type: "guide" as const,
    id: g.id,
    name: g.title,
    category: "Guides",
    description: g.description
  })),
  ...mockComponents.map(c => ({
    type: "component" as const,
    id: c.id,
    name: c.name,
    category: `Components (${c.category.toUpperCase()})`,
    description: c.description
  }))
];
