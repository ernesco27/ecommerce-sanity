"use client";

import Container from "@/components/custom/Container";
import Row from "@/components/custom/Row";
import React, { useState } from "react";
import MobileButton from "./MobileButton";
import Logo from "@/components/custom/Logo";
import MainMenu from "./MainMenu";
import IconsGroup from "./IconsGroup";
import { Session } from "next-auth";

interface SessionProp {
  session: Session | null;
}

const Main = ({ session }: SessionProp) => {
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [cartItemsCount] = useState(0);

  return (
    <section className="h-full">
      <Container>
        <Row className="w-full justify-between">
          <MobileButton />
          <div className="lg:hidden">
            <Logo />
          </div>
          <MainMenu />
          <IconsGroup
            openSearchBar={searchBarOpen}
            setOpenSearchBar={setSearchBarOpen}
            cartOpen={cartOpen}
            setCartOpen={setCartOpen}
            userOpen={userOpen}
            setUserOpen={setUserOpen}
            cartItemsCount={cartItemsCount}
            session={session}
          />
        </Row>
      </Container>
    </section>
  );
};

export default Main;
