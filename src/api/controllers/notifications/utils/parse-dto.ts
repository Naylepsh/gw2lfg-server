interface HasSeenString {
  seen?: string;
}

export const parseDto = <T extends HasSeenString>(dto: T) => {
  const { seen, ...rest } = dto;
  return seen ? { ...rest, seen: JSON.parse(dto.seen!) as boolean } : rest;
};
