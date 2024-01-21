import React, { useState, Fragment } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { searchCities } from "../api";
import { useMutation } from "@tanstack/react-query";

interface Item {
  key: string;
  city: string;
  country: string;
}

interface SearchAutocompleteProps {
  onChange: (key: string) => void;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly Item[]>([]);

  const {
    mutate: searchCityKeyMutation,
    isSuccess: isSearchCityKeySuccess,
    isPending: isSearchCityKeyPending,
  } = useMutation({
    mutationFn: searchCities,
    onSuccess: (data) => {
      setOptions(data.cities);
    },
  });

  return (
    <Autocomplete
      id="search-autocomplete"
      onChange={(_, value) => onChange(value?.key || "")}
      sx={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) =>
        option.city === value.city && option.country === value.country
      }
      getOptionLabel={(option) => `${option.country}, ${option.city}`}
      options={options}
      loading={isSearchCityKeyPending}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search city"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {isSearchCityKeyPending ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
            onChange: (event) => {
              searchCityKeyMutation(event.target.value);
            },
          }}
        />
      )}
    />
  );
};
