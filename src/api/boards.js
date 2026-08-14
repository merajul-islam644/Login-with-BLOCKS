import { getTokens } from "@/lib/tokenStore";

const GATEWAY_URL = "https://api.seliseblocks.com/data/v4/gateway";

const GET_BOARDS_QUERY = `
  query GetBoards {
    getBoards(
      where: {}
      order: []
      paging: {
        pageNo: 1
        pageSize: 10
      }
    ) {
      items {
        ItemId
        CreatedDate
        LastUpdatedDate
        CreatedBy
        Language
        LastUpdatedBy
        OrganizationId
        Tags
        Columns {
          ColumnName
          Items {
            ItemId
            Title
            Description
            Assignees
          }
        }
      }

      totalCount
      pageNo
      pageSize
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
`;

// Inlines a JS value as a GraphQL literal (no variables), since the backend's
// input type names for Columns/Items aren't known.
function gqlValue(value) {
  if (Array.isArray(value)) {
    return `[${value.map(gqlValue).join(", ")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .map(([key, val]) => `${key}: ${gqlValue(val)}`)
      .join(", ")}}`;
  }
  return JSON.stringify(value);
}

export async function insertBoard({ columns }) {
  const tokens = getTokens();

  const query = `
    mutation InsertBoard {
      insertBoard(
        input: {
          Columns: ${gqlValue(columns)}
        }
      ) {
        acknowledged
        itemId
        totalImpactedData
        message
      }
    }
  `;

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

      // Don't hard-code a real secret here.
      "x-blocks-key": "Dcdebd362c427447f99e254a620c0b0c1",
      Authorization: `Bearer ${tokens?.accessToken}`,
    },
    body: JSON.stringify({ query }),
  });

  const result = await response.json();

  if (!response.ok || result.errors) {
    throw new Error(
      result.errors?.map((error) => error.message).join(", ") ||
        "Failed to insert board",
    );
  }

  return result.data.insertBoard;
}

export async function updateBoard({ itemId, columns }) {
  const tokens = getTokens();

  const query = `
    mutation UpdateBoard {
      updateBoard(
        where: { ItemId: { eq: ${gqlValue(itemId)} } }
        input: {
          Columns: ${gqlValue(columns)}
        }
      ) {
        acknowledged
        itemId
        totalImpactedData
        message
      }
    }
  `;

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

      // Don't hard-code a real secret here.
      "x-blocks-key": "Dcdebd362c427447f99e254a620c0b0c1",
      Authorization: `Bearer ${tokens?.accessToken}`,
    },
    body: JSON.stringify({ query }),
  });

  const result = await response.json();

  if (!response.ok || result.errors) {
    throw new Error(
      result.errors?.map((error) => error.message).join(", ") ||
        "Failed to update board",
    );
  }

  return result.data.updateBoard;
}

export async function deleteBoard({ itemId, isHardDelete = false }) {
  const tokens = getTokens();

  const query = `
    mutation DeleteBoard {
      deleteBoard(
        where: { ItemId: { eq: ${gqlValue(itemId)} } }
        input: {
          isHardDelete: ${gqlValue(isHardDelete)}
        }
      ) {
        acknowledged
        itemId
        totalImpactedData
        message
      }
    }
  `;

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

      // Don't hard-code a real secret here.
      "x-blocks-key": "Dcdebd362c427447f99e254a620c0b0c1",
      Authorization: `Bearer ${tokens?.accessToken}`,
    },
    body: JSON.stringify({ query }),
  });

  const result = await response.json();

  if (!response.ok || result.errors) {
    throw new Error(
      result.errors?.map((error) => error.message).join(", ") ||
        "Failed to delete board",
    );
  }

  return result.data.deleteBoard;
}

export async function getBoards() {
  const tokens = getTokens();

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

      // Don't hard-code a real secret here.
      "x-blocks-key": "Dcdebd362c427447f99e254a620c0b0c1",
      Authorization: `Bearer ${tokens?.accessToken}`,
    },
    body: JSON.stringify({
      query: GET_BOARDS_QUERY,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const result = await response.json();

  return result.data.getBoards;
}
