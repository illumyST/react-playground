const DocusaurusPage = (): React.ReactNode => {
  return (
    <iframe
      src={`${import.meta.env.BASE_URL}docusaurus/index.html`}
      className="w-full min-h-main border-none"
      title="Docusaurus Documentation"
    />
  );
};

export default DocusaurusPage;
