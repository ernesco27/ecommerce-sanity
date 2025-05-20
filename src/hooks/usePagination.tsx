"use client";

import React, { useState } from "react";

const usePagination = (data: Array<any>, itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(data?.length / itemsPerPage);

  const currentData = () => {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;

    return data.slice(begin, end);
  };

  const next = () => {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, maxPage));
  };

  const prev = () => {
    setCurrentPage((currentPage) => Math.min(currentPage - 1, 1));
  };

  const jump = (page: number) => {
    const pageNumber = Math.max(1, page);
    setCurrentPage(() => Math.min(pageNumber, maxPage));
  };

  return { currentData, next, prev, jump, currentPage, maxPage };
};

export default usePagination;
