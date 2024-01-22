import React, { useState, Fragment, useEffect, Dispatch } from "react";
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
  onChange: Dispatch<string>;
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
      setOptions(data.citiesKey);
    },
  });

  const [inputValue, setInputValue] = React.useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue?.length < 3) return;
      searchCityKeyMutation(inputValue);
    }, 600);
    return () => clearTimeout(timeoutId);
  }, [inputValue, onChange]);

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
            onChange: (event) => setInputValue(event.target.value),
          }}
        />
      )}
    />
  );
};
