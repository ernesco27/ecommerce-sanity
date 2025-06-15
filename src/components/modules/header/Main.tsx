"use client";

import Container from "@/components/custom/Container";
import Row from "@/components/custom/Row";
import React, { useState } from "react";
import MobileButton from "./MobileButton";
import Logo from "@/components/custom/Logo";
import MainMenu from "./MainMenu";
import IconsGroup from "./IconsGroup";

const Main = () => {
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  return (
    <section className="h-full">
      <Container>
        <Row className="flex-between">
          <MobileButton />
          <Logo />
          <MainMenu />
          <IconsGroup
            openSearchBar={searchBarOpen}
            setOpenSearchBar={setSearchBarOpen}
            cartOpen={cartOpen}
            setCartOpen={setCartOpen}
            userOpen={userOpen}
            setUserOpen={setUserOpen}
            cartItemsCount={cartItemsCount}
          />
        </Row>
      </Container>
    </section>
  );
};

export default Main;
