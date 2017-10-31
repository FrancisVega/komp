module.exports = {
  label: '@@name',
  variants: [
    {
      id: 'primary',
      props: {
        classNames: ['@@name--primary'],
      },
      scenarios: [
        {
          label: 'Default',
          context: { 

            text: 'You have created this component with Komp.'
          }
        }
      ]
    }
  ]
};

