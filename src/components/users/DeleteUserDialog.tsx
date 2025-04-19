"use client";

import { TEST_IDS } from "@/constants";
import { User } from "@/types/users";
import { CloseButton, Button, Dialog, Portal, Text } from "@chakra-ui/react";

type DeleteUserDialogProps = {
  user?: User | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDelete?: () => void;
};

export const DeleteUserDialog = ({
  user,
  open,
  onOpenChange,
  onDelete,
}: DeleteUserDialogProps) => {
  if (!user || !open) return null;

  return (
    <Dialog.Root
      lazyMount
      open={true}
      closeOnInteractOutside={false}
      onOpenChange={(e) => onOpenChange?.(e.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content data-testid={TEST_IDS.DELETE_USER_DIALOG}>
            <Dialog.Header>
              <Dialog.Title>Delete User</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Text>
                Are you sure you want to delete <b>{user?.name}</b>?
              </Text>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button
                  data-testid={TEST_IDS.DELETE_USER_DIALOG_CANCEL_BUTTON}
                  variant="outline"
                >
                  Cancel
                </Button>
              </Dialog.ActionTrigger>

              <Dialog.ActionTrigger asChild>
                <Button
                  data-testid={TEST_IDS.DELETE_USER_DIALOG_DELETE_BUTTON}
                  colorPalette="red"
                  onClick={onDelete}
                >
                  Delete
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
