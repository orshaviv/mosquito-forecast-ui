import React, { useState, Fragment, useEffect, Dispatch } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { City, searchCities } from "../api";
import { useMutation } from "@tanstack/react-query";

interface SearchAutocompleteProps {
  onChange: Dispatch<string>;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly City[]>([]);

  const { mutate: searchCityKeyMutation, isPending: isSearchCityKeyPending } =
    useMutation({
      mutationFn: searchCities,
      onSuccess: (data) => {
        setOptions(data.cities);
      },
      onError: () => {
        setOptions([]);
      },
    });

  const [inputValue, setInputValue] = React.useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue?.length < 3) return;
      searchCityKeyMutation(inputValue);
    }, 600);
    return () => clearTimeout(timeoutId);
  }, [searchCityKeyMutation, inputValue, onChange]);

  return (
    <Autocomplete
      id="search-autocomplete"
      onChange={(_, value) => onChange(value?.key || "")}
      sx={{
        width: "70%",
      }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) =>
        option.localizedName === value.localizedName &&
        option.country.id === value.country.id &&
        option.administrativeArea.id === value.administrativeArea.id
      }
      getOptionLabel={(option) =>
        `${option.country.localizedName}, ${option.administrativeArea.localizedName}, ${option.localizedName}`
      }
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
