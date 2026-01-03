import { Box, Text } from "@mantine/core";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "@/shared/hooks/useThemeColors";

export const RootDropZone = () => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { active } = useDndContext();
  const { setNodeRef, isOver } = useDroppable({
    id: "root-drop-zone",
    data: {
      type: "root-zone",
    },
  });

  return (
    <Box
      ref={setNodeRef}
      style={{
        minHeight: "120px",
        marginTop: "8px",
        backgroundColor: isOver ? colors.rootDropZone.bgHover : colors.rootDropZone.bg,
        border: active
          ? isOver
            ? `2px dashed ${colors.rootDropZone.borderHover}`
            : `2px dashed ${colors.rootDropZone.border}`
          : "2px dashed transparent",
        borderRadius: "8px",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 20,
        opacity: active ? 1 : 0,
      }}
    >
      <Text
        size="sm"
        fw={500}
        style={{
          color: isOver ? colors.rootDropZone.textHover : colors.rootDropZone.text,
        }}
      >
        {t("sidebar.dropToMakeRoot")}
      </Text>
    </Box>
  );
};
