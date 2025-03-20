const MessageIcon = (props: any) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      id="message"
    >
      <g>
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path
          fill="#0076f4"
          d="M1 12C1 4 4 1 12 1s11 3 11 11-3 11-11 11S1 20 1 12"
        ></path>
        <path
          fill="#005cc9"
          fill-rule="evenodd"
          d="M16.27 16.48H9a1.72 1.72 0 0 1-1.7-1.72v-3.95L6.08 8.72a.58.58 0 0 1 .5-.87h9.69A1.72 1.72 0 0 1 18 9.58v5.18a1.72 1.72 0 0 1-1.73 1.72Z"
        ></path>
        <path
          fill="#fff"
          fill-rule="evenodd"
          d="M16.27 16.15H9a1.72 1.72 0 0 1-1.7-1.73v-3.95L6.08 8.38a.57.57 0 0 1 .5-.86h9.69A1.72 1.72 0 0 1 18 9.24v5.18a1.72 1.72 0 0 1-1.73 1.73Z"
        ></path>
        <rect
          width="7.73"
          height=".92"
          x="8.79"
          y="9.41"
          fill="#00b7ff"
          rx=".46"
        ></rect>
        <rect
          width="7.73"
          height=".92"
          x="8.79"
          y="11.24"
          fill="#00b7ff"
          rx=".46"
        ></rect>
        <rect
          width="5.88"
          height=".92"
          x="8.79"
          y="13.11"
          fill="#00b7ff"
          rx=".46"
        ></rect>
      </g>
    </svg>
  );
};

export default MessageIcon;
