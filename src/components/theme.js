import { createMuiTheme } from '@material-ui/core/styles';
import cyan from '@material-ui/core/colors/cyan';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';

export default createMuiTheme({
  palette: {
    primary: cyan,
    secondary: pink,
    error: red,

    /*
     * Used by `getContrastText()` to maximize the contrast between the background and
     * The text.
     */
    contrastThreshold: 3,

    /*
     * Used to shift a color's luminance by approximately
     * Two indexes within its tonal palette.
     * E.g., shift from Red 500 to Red 300 or Red 700.
     */
    tonalOffset: 0.2,
  },
});
