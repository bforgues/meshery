import NoSsr from '@material-ui/core/NoSsr';
import dataFetch from '../lib/data-fetch';
import {Controlled as CodeMirror} from 'react-codemirror2'
import { withStyles, Grid, FormControlLabel, Switch, TextField, Button, Snackbar, RadioGroup, Radio, FormLabel, FormControl } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import MesherySnackbarWrapper from './MesherySnackbarWrapper';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';

const styles = theme => ({
  root: {
    padding: theme.spacing(10),
    width: '100%',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  margin: {
    margin: theme.spacing(1),
  },
  alreadyConfigured: {
    textAlign: 'center',
    padding: theme.spacing(20),
  },
  colorSwitchBase: {
    color: blue[300],
    '&$colorChecked': {
      color: blue[500],
      '& + $colorBar': {
        backgroundColor: blue[500],
      },
    },
  },
  colorBar: {},
  colorChecked: {},
  uploadButton: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(3),
  },
  rightIcon: {
    // marginLeft: theme.spacing(1),
  },
  fileLabel: {
    width: '100%',
  },
  fileLabelText: {
    // width: '79%',
  },
  editorContainer: {
    width: '100%',
  },
  deleteLabel: {
    paddingRight: theme.spacing(2),
  },
  alignRight: {
    textAlign: 'right',
  }
});

class MesheryAdapterPlayComponent extends React.Component {
  constructor(props){
    super(props);
    
    this.cmEditor = null;

    // const {Name, Ops} = props;
    
    this.state = {
      showSnackbar: false,
      snackbarVariant: '',
      snackbarMessage: '',

      selectedOp: '',
      cmEditorVal: '',
      cmEditorValError: false,
      selectionError: false,

      namespace: 'default',
      namespaceError: false,
    }
  }

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ showSnackbar: false });
  };

  handleChange = name => event => {
    if (name === 'namespace' && event.target.value !== '') {
      this.setState({ namespaceError: false });  
    }
    
    if (name === 'selectedOp' && event.target.value !== '') {
      if (event.target.value === 'custom'){ 
          if(this.state.cmEditorVal !== '' && this.cmEditor.state.lint.marked.length === 0) {
            this.setState({ selectionError: false, cmEditorValError: false });  
          }
        } else {
          this.setState({ selectionError: false });  
        }
    } 

    this.setState({ [name]: event.target.value });
  };

  handleDelete = () => {
    this.handleSubmit(true)();
  }

  handleSubmit = (deleteOp=false) => () => {
    const { selectedOp, selectionError, namespace, namespaceError, cmEditorVal, cmEditorValError } = this.state;
    const {adapter} = this.props;
    if (selectedOp === '' || typeof adapter.ops[selectedOp] === 'undefined') {
        this.setState({selectionError: true});
        return;
    }
    if (selectedOp === 'custom' && (cmEditorVal === '' || this.cmEditor.state.lint.marked.length > 0)) {
      this.setState({cmEditorValError: true, selectionError: true});
      return
    }
    if (namespace === '') {
      this.setState({namespaceError: true});
      return
    }
    this.submitOp(deleteOp)
  }

  submitOp = (deleteOp=false) => {
    const { namespace, selectedOp, cmEditorVal } = this.state;
    const { index } = this.props;
    // const fileInput = document.querySelector('#k8sfile') ;

    const data = {
      'index': index,
      'query': selectedOp,
      'namespace': namespace,
      'customBody': cmEditorVal,
      'deleteOp': deleteOp? 'on':'',
    }
    
    const params = Object.keys(data).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    }).join('&');
    
    let self = this;
    dataFetch('/api/mesh/ops', { 
      credentials: 'same-origin',
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: params
    }, result => {
      if (typeof result !== 'undefined'){
        this.setState({showSnackbar: true, snackbarVariant: 'success', snackbarMessage: 'Operation success!'});
      }
    }, self.handleError);
  }

  handleError = error => {
    this.setState({showSnackbar: true, snackbarVariant: 'error', snackbarMessage: `Operation failed: ${error}`});
  }

  render() {
    const {classes, color, iconButtonClassName, avatarClassName, adapter, ...other} = this.props;
    const {
      showSnackbar, 
      snackbarVariant, 
      snackbarMessage, 

      selectedOp,
      cmEditorVal,
      namespace,

      selectionError,
      namespaceError,
      cmEditorValError,
     } = this.state;

    var self = this;
    return (
      <NoSsr>
        <React.Fragment>
          <div className={classes.root}>
          <Grid container spacing={5}>
          <Grid item xs={12}>
            <TextField
              required
              id="namespace"
              name="namespace"
              label="Namespace"
              fullWidth
              value={namespace}
              error={namespaceError}
              margin="normal"
              variant="outlined"
              onChange={this.handleChange('namespace')}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl required error={selectionError} component="fieldset">
            <FormLabel component="legend">{`Play with ${adapter.name}`}</FormLabel>
            <RadioGroup
            aria-label={`Play with ${adapter.name}`}
            name="query"
            className={classes.group}
            value={selectedOp}
            onChange={this.handleChange('selectedOp')}
            >
            {Object.keys(adapter.ops).map(key => (
              
              <FormControlLabel key={key} value={key} control={<Radio />} label={adapter.ops[key]} />
              
            ))}
           </RadioGroup>
           </FormControl>
           </Grid>
            <Grid item xs={12} hidden={selectedOp != 'custom'}>
            <FormControl required error={cmEditorValError} component="fieldset" className={classes.editorContainer}>
            <FormLabel component="legend">Custom YAML</FormLabel>
            <CodeMirror
                editorDidMount={editor => { this.cmEditor = editor }}
                value={cmEditorVal}
                options={{
                  mode: 'yaml',
                  theme: 'material',
                  lineNumbers: true,
                  lineWrapping: true,
                  gutters: ["CodeMirror-lint-markers"],
                  lint: true,
                  mode: "text/x-yaml"
                }}
                onBeforeChange={(editor, data, value) => {
                  this.setState({cmEditorVal: value});
                  if(value !== '' && this.cmEditor.state.lint.marked.length === 0) {
                    this.setState({ selectionError: false, cmEditorValError: false });  
                  }
                }}
                onChange={(editor, data, value) => {
                }}
              />
              </FormControl>
            </Grid>
          </Grid>
          <React.Fragment>
            <div className={classes.buttons}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                size="large"
                onClick={this.handleDelete}
                className={classes.button}
              >
              Revert
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                onClick={this.handleSubmit(false)}
                className={classes.button}
              >
              Submit
              </Button>
            </div>
          </React.Fragment>
          </div>
        </React.Fragment>

          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={showSnackbar}
            autoHideDuration={6000}
            onClose={this.handleSnackbarClose}
          >
          <MesherySnackbarWrapper 
            variant={snackbarVariant}
            message={snackbarMessage}
            onClose={this.handleSnackbarClose}
            />
        </Snackbar>
      </NoSsr>
    )
  }
}

MesheryAdapterPlayComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  adapter: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(MesheryAdapterPlayComponent));
