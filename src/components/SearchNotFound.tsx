import { Paper, PaperProps, Typography } from '@material-ui/core';
import useLocales from 'hooks/useLocales';

// ----------------------------------------------------------------------

interface SearchNotFoundProps extends PaperProps {
  searchQuery?: string;
}

export default function SearchNotFound({ searchQuery = '', ...other }: SearchNotFoundProps) {
  const { translate } = useLocales();
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        {translate('label.not-found')}
      </Typography>
      <Typography variant="body2" align="center">
        {translate('label.not-found-result')} &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong>. {translate('label.try-check')}
      </Typography>
    </Paper>
  );
}
