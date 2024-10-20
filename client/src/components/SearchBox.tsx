import { FaSearch } from "react-icons/fa";

export function SearchBox() {
  return (
    <div className="w-[90%] flex rounded m-3 border-gray-200 border">
      <input
        type="text"
        className="w-full p-3 outline-blue-200"
        placeholder="Search..."
      />
      <button className="p-3 bg-gray-100">
        <FaSearch />
      </button>
    </div>
  );
}
