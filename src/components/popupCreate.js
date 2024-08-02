import "./popupCreate.css";

function PopupCreate(props) {
  return props.trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn" onClick={() => props.setTrigger(false)}>
          <button className="flex items-center justify-center w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 hover:text-gray-700 focus:outline-none focus:ring focus:ring-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M14.12 5.88a.75.75 0 011.06 1.06L11.06 10l4.12 4.12a.75.75 0 11-1.06 1.06L10 11.06l-4.12 4.12a.75.75 0 11-1.06-1.06L8.94 10 4.82 5.88a.75.75 0 111.06-1.06L10 8.94l4.12-4.12a.75.75 0 011.06 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </button>
        {props.children}
      </div>
    </div>
  ) : null;
}

export default PopupCreate;
