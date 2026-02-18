export const formatTag = (tag) => {
  if (!tag.startsWith("#")) tag = `#${tag}`;
  return encodeURIComponent(tag);
};
