import * as React from "react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Icons ---
import { ChevronDownIcon } from "@/components/tiptap-icons/chevron-down-icon"
import { ListIcon } from "@/components/tiptap-icons/list-icon"

// --- Lib ---
import { isNodeInSchema } from "@/lib/tiptap-utils"

// --- Tiptap UI ---
import { ListButton, canToggleList, isListActive, listIcons } from "@/components/tiptap-ui/list-button";

import { Button, ButtonGroup } from "@/components/tiptap-ui-primitive/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/tiptap-ui-primitive/dropdown-menu"
import { Card, CardBody } from "@/components/tiptap-ui-primitive/card"
import { ListOrderedIcon } from "@/components/tiptap-icons/list-ordered-icon"
import { ListTodoIcon } from "@/components/tiptap-icons/list-todo-icon"

export const listOptions = [
  {
    label: "Bullet List",
    type: "bulletList",
    icon: ListIcon,
  },
  {
    label: "Ordered List",
    type: "orderedList",
    icon: ListOrderedIcon,
  },
  {
    label: "Task List",
    type: "taskList",
    icon: ListTodoIcon,
  },
]

export function canToggleAnyList(editor, listTypes) {
  if (!editor || !editor.isEditable) return false
  return listTypes.some((type) => canToggleList(editor, type));
}

export function isAnyListActive(editor, listTypes) {
  if (!editor || !editor.isEditable) return false
  return listTypes.some((type) => isListActive(editor, type));
}

export function getFilteredListOptions(availableTypes) {
  return listOptions.filter((option) => !option.type || availableTypes.includes(option.type));
}

export function shouldShowListDropdown(params) {
  const { editor, hideWhenUnavailable, listInSchema, canToggleAny } = params

  if (!listInSchema || !editor) {
    return false
  }

  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canToggleAny
  }

  return true
}

export function useListState(
  editor,
  availableTypes,
  hideWhenUnavailable = false
) {
  const [isVisible, setIsVisible] = React.useState(false)
  const listInSchema = availableTypes.some((type) =>
    isNodeInSchema(type, editor))
  const filteredLists = React.useMemo(() => getFilteredListOptions(availableTypes), [availableTypes])

  const canToggleAny = canToggleAnyList(editor, availableTypes)
  const isAnyActive = isAnyListActive(editor, availableTypes)
  const activeList = filteredLists.find((option) =>
    isListActive(editor, option.type))

  React.useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowListDropdown({
        editor,
        listTypes: availableTypes,
        hideWhenUnavailable,
        listInSchema,
        canToggleAny,
      }))
    }

    handleSelectionUpdate()

    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    };
  }, [canToggleAny, editor, hideWhenUnavailable, listInSchema, availableTypes])

  return {
    listInSchema,
    filteredLists,
    canToggleAny,
    isAnyActive,
    isVisible,
    Icon: activeList ? listIcons[activeList.type] : ListIcon,
  }
}

export function ListDropdownMenu({
  editor: providedEditor,
  types = ["bulletList", "orderedList", "taskList"],
  hideWhenUnavailable = false,
  onOpenChange,
  portal = false,
  ...props
}) {
  const { editor } = useTiptapEditor(providedEditor)
  const [isOpen, setIsOpen] = React.useState(false)

  const { filteredLists, canToggleAny, isAnyActive, isVisible, Icon } =
    useListState(editor, types, hideWhenUnavailable)

  const handleOnOpenChange = React.useCallback((open) => {
    setIsOpen(open)
    onOpenChange?.(open)
  }, [onOpenChange])

  if (!isVisible || !editor || !editor.isEditable) {
    return null
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOnOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          data-style="ghost"
          data-active-state={isAnyActive ? "on" : "off"}
          role="button"
          tabIndex={-1}
          disabled={!canToggleAny}
          data-disabled={!canToggleAny}
          aria-label="List options"
          tooltip="List"
          {...props}>
          <Icon className="tiptap-button-icon" />
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" portal={portal}>
        <Card>
          <CardBody>
            <ButtonGroup>
              {filteredLists.map((option) => (
                <DropdownMenuItem key={option.type} asChild>
                  <ListButton
                    editor={editor}
                    type={option.type}
                    text={option.label}
                    showTooltip={false} />
                </DropdownMenuItem>
              ))}
            </ButtonGroup>
          </CardBody>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ListDropdownMenu
