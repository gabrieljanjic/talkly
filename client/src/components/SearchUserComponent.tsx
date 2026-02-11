import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const SearchUserComponent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const handleNavigate = () => {
    const toLowerCase = searchQuery.toLowerCase();
    navigate(`/users/${toLowerCase.replace(/\s+/g, "-")}`);
  };
  return (
    <div className="flex py-2">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        className="border border-transparent bg-neutral-300 focus:outline-none focus:ring focus:ring-gray-300 flex-1 px-4 py-1 w-40 focus:border-gray-200 rounded-bl-lg rounded-tl-lg  text-gray-800"
        placeholder="Search"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-neutral-300 rounded-br-lg rounded-tr-lg cursor-pointer"
        onClick={() => handleNavigate()}
      >
        <CiSearch className="text-black hover:scale-110" />
      </button>
    </div>
  );
};

export default SearchUserComponent;
