import React from "react";
import { Box } from "@mantine/core";
import { NavLink } from "@mantine/core";
import { IconHome2 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const data = [
  {
    leftSection: <IconHome2 size="1rem" stroke={1.5} />,
    label: "Dashboard",
    path: "/",
  },
];

function Navbar() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const onClickHandler = (index: number, path: string) => {
    setActive(index);
    router.push(path);
  };

  const items = data.map((item, index) => (
    <NavLink
      href="#required-for-focus"
      key={item.label}
      active={index === active}
      label={item.label}
      leftSection={item.leftSection}
      onClick={() => {
        onClickHandler(index, item.path);
      }}
    />
  ));

  return <Box>{items}</Box>;
}

export default Navbar;
