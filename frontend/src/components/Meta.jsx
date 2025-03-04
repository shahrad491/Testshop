const Meta = ({
  title = "Welcome to ProShop",
  description = "Buy the best products",
  keywords = "electronics, home",
}) => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </>
  );
};

export default Meta;
