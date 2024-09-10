import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";

interface MultiSelectChipProps {
  itemList: string[];
  label: string;
  selectedValues: string[];
  setSelectedValues: (values: string[]) => void;
  maxSelection?: number; // Optional prop to limit the selection
}

export default function MultiSelectChip({ itemList, label, selectedValues, setSelectedValues, maxSelection }: MultiSelectChipProps) {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof selectedValues>) => {
    const { value } = event.target;
    const selected = typeof value === "string" ? value.split(",") : value;

    // Limit the selection if maxSelection is defined
    if (!maxSelection || selected.length <= maxSelection) {
      setSelectedValues(selected);
    }
  };

  return (
    <FormControl size="small" fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={selectedValues}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
      >
        {itemList.map((name) => (
          <MenuItem
            key={name}
            value={name}
            style={{
              fontWeight: selectedValues.includes(name) ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular,
            }}
          >
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
