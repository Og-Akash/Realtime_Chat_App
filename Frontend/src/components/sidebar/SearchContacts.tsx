import { Search } from "lucide-react";
import React from "react";

const SearchContacts = () => {
  return (
    <div className="w-full p-2 flex space-y-4">
      <div className="w-full space-y-2">
        <label className="input input-accent">
          <Search />
          <input
            type="search"
            className="grow"
            placeholder="Search Your Contacts..."
          />
        </label>
        <p className="text-sm font-medium text-accent">
          Your search will appeared here
        </p>
      </div>
    </div>
  );
};

export default SearchContacts;
